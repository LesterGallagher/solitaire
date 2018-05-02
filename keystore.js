
const fs = require('fs');
const { exec } = require('child_process');
const packageJson = require('../package.json');
const path = require('path');

const settings = {};
fs.readFileSync(path.join(__dirname, '../platforms/android/release-signing.properties')).toString()
  .split('\n')
  .map(line => line.split('='))
  .map(tuple => settings[tuple[0]] = tuple[1]);

if (!fs.existsSync(path.join(__dirname, '../platforms/android/app.keystore'))) {
  const childProcess = exec(` keytool -genkey -v -keystore platforms/android/app.keystore -alias ${settings.keyAlias} -keyalg RSA -keysize 2048 -validity 10000` , (err, stdout, stderr) => {
    if (err) {
      console.error('unable to create app.keystore: ' + err);
      return;
    }
  });
  childProcess.stdin.write(`${settings.storePassword}\n`); // Enter keystore password:
  childProcess.stdin.write(`${settings.storePassword}\n`); // Re-enter new password:
  childProcess.stdin.write(`${packageJson.author.name}\n`); // What is your first and last name?
  childProcess.stdin.write('\n'); // What is the name of your organizational unit?
  childProcess.stdin.write(`${packageJson.author.organization}\n`); // What is the name of your organization?
  childProcess.stdin.write(`${packageJson.author.city}\n`); // What is the name of your City or Locality?
  childProcess.stdin.write(`${packageJson.author.province}\n`); // What is the name of your State or Province?
  childProcess.stdin.write(`${packageJson.author.countryCode}\n`); // What is the two-letter country code for this unit?
  childProcess.stdin.write('yes\n'); // Is correct?
  childProcess.stdin.write(`${settings.keyPassword}\n`); // Enter key password
  childProcess.stdin.end();
}


