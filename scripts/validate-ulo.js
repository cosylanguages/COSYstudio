const fs = require('fs');
const path = require('path');
const { validateUlo } = require('../dist/utils/validate');

function runValidation() {
  console.log('🔍 Running COSYstudio ULO Schema Validator...');
  const fixturePath = path.join(__dirname, '../tests/fixtures/sample-ulo.json');

  if (!fs.existsSync(fixturePath)) {
    console.error(`❌ Fixture file not found: ${fixturePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(fixturePath, 'utf8');
  const sampleUlo = JSON.parse(rawData);

  const result = validateUlo(sampleUlo);
  if (result.valid) {
    console.log(`✅ Sample ULO (${sampleUlo.cid}) is VALID according to schemas/ulo.schema.json!`);
  } else {
    console.error(`❌ Validation FAILED for ULO (${sampleUlo.cid}):`);
    result.errors.forEach((err) => console.error(`   - ${err}`));
    process.exit(1);
  }
}

runValidation();
