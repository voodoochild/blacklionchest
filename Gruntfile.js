module.exports = function(grunt) {

    // Config
    grunt.initConfig({
        shell: {
            clean: {
                command: 'rm -rf dist'
            },

            build: {
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
    grunt.registerTask('default', ['shell:clean', 'shell:build', 'shell:deploy', 'shell:clean']);

};
