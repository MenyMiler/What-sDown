module.exports = {
    env: {
        browser: true,
    },
    extends: [
        'airbnb',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@tanstack/eslint-plugin-query/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', '@tanstack/query'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts', '.tsx'],
            },
        },
    },
    rules: {
        quotes: ['error', 'single'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'no-unused-vars': 'off',
        'no-console': 'warn',
        'linebreak-style': ['error', 'unix'],
        'no-empty': 'warn',
        'no-use-before-define': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'react/jsx-filename-extension': [
            2,
            {
                extensions: ['.tsx'],
            },
        ],
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['state'],
            },
        ],
        'react/jsx-key': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        'no-plusplus': 'off',
    },
};
