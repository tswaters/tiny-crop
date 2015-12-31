
module.exports = (grunt) => {

  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),
    'name': '<%= pkg.name.toLowerCase() %>',
    'banner': [
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
      lib: ['lib'],
      docs: ['docs'],
      coverage: ['test/reports/coverage'],
      analysis: ['test/reports/analysis']
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: [
          ['babelify', {
            presets: ['es2015']
          }]
        ]
      },
      dist: {
        files: {
          './lib/tiny-crop.js': [
            'src/util.js',
            'src/index.js',
            'src/tiny-crop.js'
          ]
        }
      }
    },

    extract_sourcemap: {
      dist: {
        files: {
          'lib/': 'lib/tiny-crop.js'
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>\n',
        compress: {
          unsafe: true
        },
        sourceMap: true,
        sourceMapIn: 'lib/tiny-crop.js.map'
      },
      compat: {
        files: {
          'dist/tiny-crop.compat.min.js': ['./lib/tiny-crop.compat.js']
        }
      },
      dist: {
        options: {
          screwIE8: true
        },
        files: {
          'dist/tiny-crop.min.js': ['./lib/tiny-crop.js']
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
          private: false
        }
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['browserify', 'extract_sourcemap', 'uglify:dist']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-extract-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'clean:dist',
    'clean:lib',
    'browserify',
    'extract_sourcemap',
    'uglify:dist'
  ]);

  grunt.registerTask('lint', [
    'eslint'
  ]);

  grunt.registerTask('test', [
    'clean:analysis',
    'clean:coverage',
    'shell:test',
    'shell:coverage'
  ]);

  grunt.registerTask('docs', [
    'clean:docs',
    'jsdoc'
  ]);

  grunt.registerTask('dev', [
    'default',
    'watch'
  ]);

};
