module.exports = function(grunt) {

    // Config
    grunt.initConfig({
        shell: {
            build: {
                command: 'rm -rf dist; harp compile _harp dist; find dist -name "*.DS_Store" -type f -delete'
            },

            publish: {
                command: 'scp -r dist/* blacklionchest:~/blacklionchest_www'
            }
        }
    });

    // Package tasks
    grunt.loadNpmTasks('grunt-shell');

    // Custom tasks
    grunt.registerTask('build', 'shell:build');
    grunt.registerTask('deploy', 'shell:publish');

};
