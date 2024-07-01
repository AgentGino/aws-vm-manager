import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class Vpc extends Construct {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Use the default VPC
    this.vpc = ec2.Vpc.fromLookup(this, 'Default', { isDefault: true });
  }
}