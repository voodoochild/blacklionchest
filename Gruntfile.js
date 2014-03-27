module.exports = function(grunt) {
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
        }
    });

    // Package tasks
    grunt.loadNpmTasks('grunt-shell');

    // Custom tasks
    grunt.registerTask('default', ['shell:run']);
    grunt.registerTask('build',   ['shell:clean', 'shell:build']);
    grunt.registerTask('deploy',  ['shell:deploy', 'shell:clean']);
};
