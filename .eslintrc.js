// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off', // 0/'off' 关闭此项语法检查, 1 作为一个黄色警告, 2 作为一个红色错误
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // kjf
        "indent": [0, 4],//缩进风格 [2, 4]
        "no-undef": 1, // 不能有未定义的变量
        "no-unreachable": 1, // 不能有无法执行的代码
        "camelcase": 0, // 强制驼峰法命名
        "eqeqeq": 2, // 必须使用全等
        "new-parens": 2, // new时必须加小括号
        "quotes": [1, "single"], // 引号类型 `` "" ''
        "radix": 2, // parseInt必须指定第二个参数
        "space-after-keywords": [0, "always"], // 关键字后面不要空一格
        "space-before-function-paren": [0, "always"], // 函数定义时括号前面要不要有空格
        "spaced-comment": 0, // 注释风格要不要有空格什么的
        "use-isnan": 2, // 禁止比较时使用NaN，只能用isNaN()
        "wrap-iife": [2, "inside"], // 立即执行函数表达式的小括号风格
        "wrap-regex": 0, // 正则表达式字面量用小括号包起来
        "comma-style": [2, "last"], // 分后在语句的最后
        "semi": [2, "always"], // 总是写分号
        'operator-linebreak': [2, 'before'], // 换行时运算符在行尾
        'vue/no-parsing-error': ['error', {
            'invalid-first-character-of-tag-name': false
        }],
        'no-irregular-whitespace': 2
    }
};
