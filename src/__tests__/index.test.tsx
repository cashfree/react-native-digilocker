import fs from 'fs';
import path from 'path';

describe('SafeAreaView import', () => {
  it('imports SafeAreaView from react-native-safe-area-context, not react-native core', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../index.tsx'),
      'utf8'
    );

    // React Native's core SafeAreaView is a no-op on Android, which caused
    // the consent screen's Allow/Deny buttons to render behind the system
    // navigation bar. Guard against reintroducing it.
    const coreImportMatch = source.match(
      /import\s*\{([^}]*)\}\s*from\s*'react-native';/
    );
    expect(coreImportMatch).not.toBeNull();
    expect(coreImportMatch![1]).not.toMatch(/\bSafeAreaView\b/);

    expect(source).toMatch(
      /import\s*\{\s*SafeAreaView\s*\}\s*from\s*'react-native-safe-area-context';/
    );
  });
});
