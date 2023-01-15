# EZMC Game Service

Service responsible for hosting the latest Minecraft Java server edition on an AWS ECS Cluster.

## Deployment

This game service is deployed as a Docker container to [AWS ECS](https://aws.amazon.com/ecs/). [Serverless Framework](https://www.serverless.com/framework/docs) leverages a [Cloudformation template](https://aws.amazon.com/cloudformation/resources/templates/) to provision cloud resources.

### Manual

To deploy manually from a dev workstation, install Serverless and run the `deploy` command.

```sh
npm install -g serverless@3
serverless deploy --verbose
```

By default, the deployment will be staged as `dev` to the `us-east-1` region.

### CI/CD

This server can be deployed with [AppVeyor](https://www.appveyor.com/docs/getting-started-with-appveyor-for-linux/).

You must update `appveyor.yml` with your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. It is recommended that you use [secure variables](https://www.appveyor.com/docs/build-configuration/#:~:text=Secure%20variables,-When%20you%20work&text=AppVeyor%20generates%20a%20unique%20encryption,Account%20%E2%86%92%20Encrypt%20YAML%20page.&text=%E2%80%9CSecure%E2%80%9D%20variables%20means%20you%20can,that%20is%20visible%20to%20others.) for these secrets.

## License

This project is distributed under the terms of the [MIT License](./LICENSE).
