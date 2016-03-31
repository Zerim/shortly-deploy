module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n',
      },
      dep: {
        src: ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'],
        dest: 'public/dist/dep.concat.js'
      },
      app: {
        src: 'public/client/*.js',
        dest: 'public/dist/app.concat.js'
      }

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'public/dist/dep.min.js': ['public/dist/dep.concat.js'],
          'public/dist/app.min.js': ['public/dist/app.concat.js']
        }
      }
    },
    clean: {
      contents: ['public/dist/*', 'eslint_output.txt']
    },

    eslint: {
      options: {
        rulesDir: '.eslintrc.js',
        quiet: true,
        outputFile: 'eslint_output.txt'
      },
      target: ['**/*.js']
    },

    cssmin: {
      dist: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    exec: {
      prodServer: {
        cmd: 'git push live master'
      },
      target: {
        cmd: 'echo hello'
      },
    },
    gitcheck: {
      options: {
        branchChecking: true,
        enforceUncommitedChanges: true,
        enforceUpdates: true
      },

      production: {
        braches: ['master']
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-gitcheck');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['mochaTest', 'eslint', 'clean', 'concat:dep', 'concat:app', 'uglify:dist', 'cssmin:dist']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['gitcheck:production', 'shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['build', 'upload']);

};
