// Original shader from http://glslsandbox.com/e#45634.0,

var CRTFragmentSrc = [
"precision highp float;",
"uniform float time;",
"uniform vec2 resolution;",

"vec2 CRTCurveUV( vec2 uv )",
"{",
"uv = uv * 2.0 - 1.0;",
"vec2 offset = abs( uv.yx ) / vec2( 6.0, 4.0 );",
"uv = uv + uv * offset * offset;",
"uv = uv * 0.5 + 0.5;",
"return uv;",
"}",

"void DrawVignette( inout vec4 color, vec2 uv )",
"{",
"float vignette = uv.x * uv.y * ( 1.0 - uv.x ) * ( 1.0 - uv.y );",
"vignette = clamp( pow( 16.0 * vignette, 0.3 ), 0.0, 1.0 );",
"color.xyz *= vignette;",
"}",

"void DrawScanline( inout vec4 color, vec2 uv )",
"{",
"float scanline 	= clamp( 0.95 + 0.05 * cos( 3.14 * ( uv.y + 0.008 * time ) * 240.0 * 1.0 ), 0.0, 1.0 );",
"float grille 	= 0.85 + 0.15 * clamp( 1.5 * cos( 3.14 * uv.x * 640.0 * 1.0 ), 0.0, 1.0 );",
"color.xyz *= scanline * grille * 1.2;",
"}",

"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"// we want to see at least 80x60 (overscan) and we want multiples of pixel size,",
"float resMultX  = floor( resolution.x / 80.0 );",
"float resMultY  = floor( resolution.y / 60.0 );",
"float resRcp	= 1.0 / max( min( resMultX, resMultY ), 1.0 );",

"float screenWidth	= floor( resolution.x * resRcp );",
"float screenHeight	= floor( resolution.y * resRcp );",
"float pixelX 		= floor( fragCoord.x * resRcp );",
"float pixelY 		= floor( fragCoord.y * resRcp );",

"vec4 color = vec4( 0.18, 0.18, 0.1, 0.5 );",
"// CRT effects (curvature, vignette, scanlines and CRT grille),",
"vec2 uv    = fragCoord.xy / resolution.xy;",
"vec2 crtUV = CRTCurveUV( uv );",
"if ( crtUV.x < 0.0 || crtUV.x > 1.0 || crtUV.y < 0.0 || crtUV.y > 1.0 )",
"{",
"color = vec4( .0, .0, .0, 1 );",
"}",

"DrawVignette( color, crtUV );",
"DrawScanline( color, uv );",
"fragColor.xyzw 	= color;",
"}",

"void main(void)",
"{",
"mainImage(gl_FragColor, gl_FragCoord.xy);",
"}"
];
