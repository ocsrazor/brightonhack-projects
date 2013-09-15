module.exports = function (grunt) {
    
    grunt.loadNpmTasks("grunt-contrib-connect");

    var packageJson = grunt.file.readJSON("package.json");

    grunt.initConfig({
        pkg: packageJson,

        connect: {
            dev: {
                options: {
                    port: 3000,
                    base: "./",
                    keepalive: true
                }
            }
        }
    });

    // grunt.registerTask("default", [
    //     "ts"
    // ]);
};