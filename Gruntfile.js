module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
obfuscator: {
    options: {
        cpmpact: true,
        //debugProtection: true,
        //debugProtectionInterval: true
        disableConsoleOutput: false,
        target: "browser"
    },
    task1: {
        options: {
            // options for each sub task
        },
        files: {
            'dest/output.js': [
                'src/js/file1.js',
                'src/js/file2.js'
            ]
        }
    }
}
});

grunt.loadNpmTasks('grunt-contrib-obfuscator');

// Default task(s).
grunt.registerTask('default', ['obfuscator']);

};
