import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface SecurityGroupProps {
  vpc: ec2.IVpc;
  laptopIp: string;
}

export class SecurityGroup extends Construct {
  public readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: SecurityGroupProps) {
    super(scope, id);

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: 'Security group for EC2 instances',
      allowAllOutbound: true,
    });

    // Allow all traffic from your laptop's public IP
    this.securityGroup.addIngressRule(ec2.Peer.ipv4(`${props.laptopIp}/32`), ec2.Port.allTraffic(), 'Allow all traffic from laptop');

    // Allow instances to communicate with each other
    this.securityGroup.addIngressRule(this.securityGroup, ec2.Port.allTraffic(), 'Allow all traffic between instances');
  }
}