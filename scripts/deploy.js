const { program } = require('commander');
const shell = require("shelljs");

if (!shell.which("aws")) {
    shell.echo("Sorry, this script requires aws");
    shell.exit(1);
}
if (!shell.which("git")) {
    shell.echo("Sorry, this script requires git");
    shell.exit(1);
}

// Get Arguments & Environment Variables
program
    .version("0.1.0")
    .option("-s, --stage [stage]", "AWS stage", "dev")
    .option("-a, --application [application]", "Application to deploy")
    .option("-f, --force", "Force deploy")
    .parse(process.argv)

const options = program.opts();
options.profile = process.env.PROFILE;
options.region = process.env.AWS_REGION;
if (!options.application) {
    console.error("App was not provided.");
}

console.log(`Deploying App=${options.application ? options.application : "ALL"}, Stage=${options.stage}, Region=${options.region}, Profile=${options.profile}`);

// Get AWS Account ID
let getAccountIdCmd = `aws sts get-caller-identity --output text --query 'Account' --profile ${options.profile}`;
let awsAccountId = shell.exec(getAccountIdCmd, { silent: true }).stdout.replace(/\n$/, "");
console.log(`ACCOUNT_ID is ${awsAccountId}`);

if (!awsAccountId) {
    shell.echo("AWS Account id could not been found.");
    shell.exit(1);
}

// Go to Apps Folder
shell.cd("apps");

// Set SLS Command Arguments
let force = "";
if (options.force) {
    console.log("Setting force deployment");
    force = "--force";
}

// Deploy Apps
const APPS = ["auth", "owners", "products", "releases", "search"];
const appsToDeploy = options.application ? [options.application] : APPS;
appsToDeploy.map(application => {
    // Go to Application Folder
    shell.cd(application);

    // Install Dependencies
    const npmInstallResult = shell.exec("npm install");
    if (npmInstallResult.code !== 0) {
        shell.echo("Error installing npm packages.");
        shell.exit(1);
    }

    // Create Bucket
    console.log(`Deploying app from ${application} folder`);
    const bucketApp = application.startsWith("db") || application.startsWith("storage") ? `example-${application}` : `example-apps-${application}`;
    const deployCmdBucket = `aws s3api create-bucket --bucket "${options.region}.${awsAccountId}.deploys.${bucketApp}" --region=${options.region} --profile=${options.profile}`;
    console.log(`Executing: ${deployCmdBucket}`);
    const bucketResult = shell.exec(deployCmdBucket);
    if (bucketResult.code !== 0) {
        shell.echo("Error creating bucket in AWS.");
        shell.exit(1);
    }

    // Do the Deployment
    if (shell.test('-e', 'serverless.yml')) {
        const deployCmd = `sls deploy --stage ${options.stage} --region ${options.region} --aws-profile ${options.profile} ${force}`;
        shell.env["REGION"] = `${options.region}`;
        shell.env["ACCOUNT_ID"] = `${awsAccountId}`;
        shell.env["AWS_PROFILE"] = `${options.profile}`;
        shell.env["SLS_DEBUG"] = `true`;

        console.log(`Current App: ${application}`);
        console.log(`Current path: ${shell.pwd()}`);
        console.log(`Executing: ${deployCmd}`);

        const deployResult = shell.exec(deployCmd);
        if (deployResult.code !== 0) {
            shell.echo("Error deploying in AWS.");
            shell.exit(1);
        }
    }

    // Go Back to the Apps Folder
    shell.cd("..");
});
