#!/bin/bash

# Function to get EC2 instance status
get_ec2_status() {
    local instance_id=$1
    aws ec2 describe-instance-status --instance-ids $instance_id --query "InstanceStatuses[0].InstanceState.Name" --output text
}

# Configuration
CONFIG_FILE="config/instances.yaml"
STACK_NAME="AwsVmManagerStack" # Replace with your stack name
REGION="us-east-1" # Replace with your AWS region
SSH_CONFIG_FILE="./ssh_config"

# Get the key pair path from the config file
KEY_PAIR_PATH=$(yq e '.keyPair.path' $CONFIG_FILE)

# Get stack outputs
outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs" --output json)

# Clear existing SSH config file or create a new one
> $SSH_CONFIG_FILE

# Print table header
printf "%-20s %-15s %-15s %-50s\n" "Instance Name" "Public IP" "Status" "SSH Command"
printf "%s\n" "----------------------------------------------------------------------------------------------------"

# Parse and print instance details
for row in $(echo "${outputs}" | jq -r '.[] | @base64'); do
    _jq() {
        echo ${row} | base64 --decode | jq -r ${1}
    }
    
    output_key=$(_jq '.OutputKey')
    output_value=$(_jq '.OutputValue')
    export_name=$(_jq '.ExportName')
    
    if [[ $export_name == *"PublicIp" ]]; then
        instance_name=$(echo $export_name | sed 's/PublicIp//')
        public_ip=$output_value
        
        # Get instance ID
        instance_id=$(aws ec2 describe-instances --filters "Name=network-interface.addresses.association.public-ip,Values=$public_ip" --query "Reservations[0].Instances[0].InstanceId" --output text)
        
        # Get instance status
        status=$(get_ec2_status $instance_id)
        
        # Generate SSH command
        ssh_command="ssh -i $KEY_PAIR_PATH ubuntu@$public_ip"
        
        # Print instance details
        printf "%-20s %-15s %-15s %-50s\n" "$instance_name" "$public_ip" "$status" "$ssh_command"
        
        # Generate SSH config
        {
            echo "Host $instance_name"
            echo " HostName $public_ip"
            echo " User ubuntu"
            echo " IdentityFile $KEY_PAIR_PATH"
            echo ""
        } >> $SSH_CONFIG_FILE
    fi
done

echo
echo "SSH config file generated at $SSH_CONFIG_FILE"