var cheerio = require('cheerio');
var path = require('path');
var url = require('url');

module.exports = function (grunt) {
  // Config
  grunt.initConfig({
    shell: {
      run: {
        options: {
          stdout: true
        },
        command: 'harp server _harp'
      },
      clean: {
        command: 'rm -rf dist'
      },
      build: {
        options: {
          stdout: true
        },
        command: 'harp compile _harp dist; find dist -name "*.DS_Store" -type f -delete'
      },
      deploy: {
        command: 'scp -r dist/* blacklionchest:~/blacklionchest_www'
      }
    },

    inlinecss: {
      dist: {
        options: {
          cssDir: 'dist/'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.html'],
          dest: 'dist/'
        }]
      }
    }
  });

  // Package tasks
  grunt.loadNpmTasks('grunt-shell');

  // Custom tasks
  grunt.registerTask('default', ['shell:run']);
  grunt.registerTask('build',   ['shell:clean', 'shell:build', 'inlinecss']);
  grunt.registerTask('deploy',  ['shell:deploy', 'shell:clean']);

  // Inline CSS, based on https://github.com/motherjones/grunt-html-smoosher
  grunt.registerMultiTask('inlinecss', 'Inline local CSS files', function () {
    var options = this.options({
      cssDir: ""
    });

    this.files.forEach(function (filePair) {
      if (filePair.src.length === 0) { return; }
      var $ = cheerio.load(grunt.file.read(filePair.src));
      grunt.log.writeln('Reading: ' + path.resolve(filePair.src.toString()));

      $('link[rel="stylesheet"]').each(function () {
        var style = $(this).attr('href');
        if (!style) { return; }
        if (style.match(/^\/\//) || url.parse(style).protocol) { return; }

        var filePath = (style.substr(0, 1) === '/') ?
          path.resolve(options.cssDir, style.substr(1)) :
          path.join(path.dirname(filePair.src), style);

        grunt.log.writeln(('Including CSS: ').cyan + filePath);
        $(this).replaceWith('<style>' + grunt.file.read(filePath) + '</style>');
      });

      grunt.file.write(path.resolve(filePair.dest), $.html());
      grunt.log.writeln(('Created ').green + path.resolve(filePair.dest));
    });
  });
};
