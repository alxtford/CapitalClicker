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
            '/': [
                'client/assetDraw.js',
                'client/assetLoad.js',
                "client/crtFilter.js",
                "client/DayNight.js",
                "client/defaultData.JSON",
                "client/inputManager.js",
                "client/loader.js",
                "client/main.js",
                "client/survey.js",
                "client/ui.js",
                "client/upgradeDefs.js"
            ]
        }
    }
}
});

grunt.loadNpmTasks('grunt-contrib-obfuscator');

// Default task(s).
grunt.registerTask('default', ['obfuscator']);

};
