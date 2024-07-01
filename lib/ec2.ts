import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

export interface Ec2Props {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
  keyName: string;
  config: any;
}

export class Ec2 extends Construct {
  constructor(scope: Construct, id: string, props: Ec2Props) {
    super(scope, id);
    props.config.instances.forEach((instance: any) => {
      const ec2Instance = new ec2.Instance(this, instance.name, {
        instanceType: new ec2.InstanceType(instance.type),
        machineImage: ec2.MachineImage.fromSsmParameter(
          "/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id",
          { os: ec2.OperatingSystemType.LINUX }
        ),
        vpc: props.vpc,
        securityGroup: props.securityGroup,
        keyName: props.keyName,
      });

      // Output instance details
      new cdk.CfnOutput(this, `${instance.name}InstanceId`, {
        value: ec2Instance.instanceId,
        exportName: `${instance.name}InstanceId`,
      });

      new cdk.CfnOutput(this, `${instance.name}PublicIp`, {
        value: ec2Instance.instancePublicIp,
        exportName: `${instance.name}PublicIp`,
      });

      new cdk.CfnOutput(this, `${instance.name}PrivateIp`, {
        value: ec2Instance.instancePrivateIp,
        exportName: `${instance.name}PrivateIp`,
      });
    });
  }
}
