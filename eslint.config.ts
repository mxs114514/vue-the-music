import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
// 如果想在 `.vue` 文件中允许除 `ts` 以外的脚本语言，请取消注释下面的示例行：
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })

const config: any = defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  // 自定义规则
  {
    name: 'app/custom-rules',
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': 'warn', // 未使用变量警告
      '@typescript-eslint/no-explicit-any': 'warn', // 避免使用 any

      // Vue 规则
      'vue/multi-word-component-names': 'off', // 允许单词组件名（如 App.vue）
      'vue/no-multiple-template-root': 'off', // Vue 3 支持多个根元素
      'vue/require-default-prop': 'warn', // Props 建议设置默认值

      // 通用规则
      'no-console': 'warn', // 警告 console（可在开发时忽略）
      'no-debugger': 'error', // 禁止 debugger
      'prefer-const': 'error', // 强制使用 const
    },
  },
)

export default config
