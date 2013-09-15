(function(window){
    'use strict';

    Pablo.template('frog', function(x, width){
        x || (x = 180);
        width || (width = window.innerWidth + 335);

        var image = Pablo.image({
                'xlink:href': 'frog.svg',
                width: 334.9375,
                height: 225.53125
            }),

            anim = Pablo.animateMotion({
                path: 'M -173.60302,444.50907 C -32.548276,196.60278 226.6549,250.3447 272.46756,434.10741',
                fill: 'freeze',
                dur: '0.7s',
                begin: 'indefinite',
                repeatCount: 1
            }),

            frog = Pablo.g();
            frog.append(image)
                .append(anim)
                .transform('translate', x)
                .transform('scale', 0.25);

            frog.data('interval', window.setInterval(function(){
                    x += 450;

                    if (x < width){
                        frog.transform('translate', x);
                        anim[0].beginElement();
                    }
                    else {
                        window.clearTimeout(frog.data('interval'));
                        frog.remove();
                    }
                }, 900)
            );

        anim[0].beginElement();

        return frog;
    });
}(window));