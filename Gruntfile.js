'use strict'

module.exports = (grunt) => {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    name: '<%= pkg.name.toLowerCase() %>',
    banner: [
      '/*',
      '<%= pkg.name %> - <%= pkg.description %> v<%= pkg.version%>',
      'built <%= grunt.template.today(\'UTC:yyyy-mm-dd"T"HH:MM:ss.l"Z"\') %>',
      '<%= grunt.file.read("LICENSE") %>',
      '*/'
    ].join('\n'),

    clean: {
      options: {
        force: true
      },
      dist: ['dist'],
      docs: ['docs'],
      coverage: ['test/reports/coverage'],
      analysis: ['test/reports/analysis']
    },

    'string-replace': {
      dist: {
        files: {
          'dist/tiny-crop.js': 'src/main.js'
        },
        options: {
          replacements: [
            {
              pattern: /\/\* \@include (.+?) \*\//gi,
              replacement (match, file) {
                return grunt.file.read(`src/${file}`)
                  //.replace(/(^|\n)/gi, '$1  ')
                  //.replace(/\s{1,}\n/gi, '\n')
              }
            }
          ]
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>\n',
        compress: {
          unsafe: true,
          evaluate: false
        },
        mangle: {
        },
        exceptionsFiles: [
          '.uglifyjs'
        ],
        mangleProperties: {},
        sourceMap: true
      },
      dist: {
        options: {
          screwIE8: true
        },
        files: {
          'dist/tiny-crop.min.js': ['dist/tiny-crop.js']
        }
      }
    },

    eslint: {
      options: {
        format: require('eslint-html-reporter'),
        outputFile: 'test/reports/analysis/report.html'
      },
      target: [
        'src/**/*.js',
        'test/unit/**/*.js',
        'Gruntfile.js'
      ]
    },

    shell: {
      coverage: {
        command: 'npm run-script coverage'
      },
      test: {
        command: 'npm run-script test'
      }
    },

    jsdoc: {
      dist: {
        src: [
          'README.MD',
          'src/**/*.js'
        ],
        options: {
          destination: 'docs',
          private: false,
          configure: './jsdoc.conf.json',
          template: 'node_modules/ink-docstrap/template'
        }
      }
    },

    mocha_istanbul: {
      coverage: {
        src: 'test/unit',
        options: {
          coverageFolder: 'test/reports/coverage',
          istanbulOptions: [
            '--hook-run-in-context'
          ],
          mask: '*.test.js'
        }
      }
    },

    selenium_standalone: {
      dev: {
        seleniumVersion: '2.50.1',
        seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
        drivers: {
          chrome: {
            version: '2.15',
            arch: process.arch,
            baseURL: 'http://chromedriver.storage.googleapis.com'
          },
          ie: {
            version: '2.45',
            arch: process.arch,
            baseURL: 'http://selenium-release.storage.googleapis.com'
          }
        }
      }
    },

    webdriver: {
      test: {
        configFile: './wdio.conf.js'
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['default']
      }
    }
  })

  grunt.loadNpmTasks('grunt-selenium-standalone')
  grunt.loadNpmTasks('grunt-webdriver')
  grunt.loadNpmTasks('grunt-mocha-istanbul')
  grunt.loadNpmTasks('grunt-jsdoc')
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-string-replace')

  grunt.registerTask('default', [
    'clean:dist',
    'string-replace:dist',
    'uglify:dist'
  ])

  grunt.registerTask('lint', [
    'clean:analysis',
    'eslint'
  ])

  grunt.registerTask('integration', [
    'selenium_standalone:dev:install',
    'selenium_standalone:dev:start',
    'webdriver:test',
    'selenium_standalone:dev:stop'
  ])

  grunt.registerTask('test', [
    'clean:coverage',
    'mocha_istanbul',
    'integration'
  ])

  grunt.registerTask('docs', [
    'clean:docs',
    'jsdoc'
  ])

  grunt.registerTask('dev', [
    'default',
    'watch'
  ])

  grunt.registerTask('publish', [
    'default',
    'test',
    'lint',
    'docs'
  ])

}
