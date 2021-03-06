// Generated by CoffeeScript 1.3.3
(function() {
  var delPart, fields, he, key, manifest, preload, setPart, val;

  he = {};

  preload = new PreloadJS();

  fields = {
    b: "./images/block.jpg",
    s: "./images/stone.jpg",
    o: "./images/bomb.png",
    f: "./images/fire.png",
    g: "./images/grass.jpg",
    c: "./images/chara.png",
    "if": "./images/item2.png",
    io: "./images/item3.png",
    e: "./images/item7.png"
  };

  manifest = [];

  for (key in fields) {
    val = fields[key];
    manifest.push({
      src: val
    });
  }

  he["static"] = new Stage("static");

  he.flow = new Stage('flow');

  he.dead = false;

  preload.loadManifest(manifest);

  preload.onComplete = function() {
    var socket;
    socket = io.connect('http://localhost:3000/');
    socket.on('char dead', function() {
      return he.dead = true;
    });
    socket.on('stage init', function(ini) {
      var id, info, row, x, y, _base, _base1, _ref, _ref1, _ref2;
      he["static"].objmap = [];
      he.flow.objmap = [];
      he.flow.chars = {};
      _ref = ini.map;
      for (y in _ref) {
        row = _ref[y];
        (_base = he["static"].objmap)[y] || (_base[y] = []);
        for (x in row) {
          info = row[x];
          setPart(he["static"], {
            x: x,
            y: y,
            type: info.type
          });
        }
      }
      _ref1 = ini.flow;
      for (y in _ref1) {
        row = _ref1[y];
        (_base1 = he.flow.objmap)[y] || (_base1[y] = []);
        for (x in row) {
          info = row[x];
          if (typeof info.type !== 'undefined') {
            setPart(he.flow, {
              x: x,
              y: y,
              type: info.type
            });
          }
        }
      }
      _ref2 = ini.char;
      for (id in _ref2) {
        info = _ref2[id];
        if (typeof he.flow.chars[id] === 'undefined') {
          setPart(he.flow, {
            x: info.x,
            y: info.y,
            type: info.type
          }, info.id);
        } else {
          he.flow.chars[id].x = info.x * 30;
          he.flow.chars[id].y = info.y * 30;
        }
      }
      return setTimeout(function() {
        he["static"].update();
        return he.flow.update();
      }, 20);
    });
    socket.on('stage sync', function(diff) {
      var id, info, obj, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      _ref = diff.flow["delete"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        info = _ref[_i];
        delPart(he.flow, {
          x: info.x,
          y: info.y,
          type: info.type
        });
      }
      _ref1 = diff.flow.add;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        info = _ref1[_j];
        setPart(he.flow, {
          x: info.x,
          y: info.y,
          type: info.type
        });
      }
      _ref2 = diff.char;
      for (id in _ref2) {
        info = _ref2[id];
        if (typeof he.flow.chars[id] === 'undefined') {
          setPart(he.flow, {
            x: info.x,
            y: info.y,
            type: info.type
          }, id);
        } else {
          he.flow.chars[id].x = info.x * 30;
          he.flow.chars[id].y = info.y * 30;
        }
      }
      _ref3 = he.flow.chars;
      for (id in _ref3) {
        obj = _ref3[id];
        if (typeof diff.char[id] === 'undefined') {
          he.flow.removeChild(he.flow.chars[id]);
          delete he.flow.chars[id];
        }
      }
      return setTimeout(function() {
        he.flow.update();
        if (he.dead) {
          he.dead = false;
          return alert('あぼーん');
        }
      }, 20);
    });
    return window.document.onkeydown = function(e) {
      var code;
      if (e.keyCode === 32) {
        code = 's';
      }
      if (e.keyCode === 37) {
        code = 'l';
      }
      if (e.keyCode === 38) {
        code = 'u';
      }
      if (e.keyCode === 39) {
        code = 'r';
      }
      if (e.keyCode === 40) {
        code = 'd';
      }
      return socket.send(code);
    };
  };

  setPart = function(canvas, opt, id) {
    var image;
    image = new Bitmap(fields[opt.type]);
    image.width = image.height = 30;
    image.x = opt.x * 30;
    image.y = opt.y * 30;
    if (typeof id === 'undefined') {
      if (typeof canvas.objmap[opt.y][opt.x] === 'undefined' || canvas.objmap[opt.y][opt.x] === null) {
        return canvas.objmap[opt.y][opt.x] = canvas.addChild(image);
      }
    } else {
      return canvas.chars[id] = canvas.addChild(image);
    }
  };

  delPart = function(canvas, opt, id) {
    if (typeof id === 'undefined') {
      canvas.removeChild(canvas.objmap[opt.y][opt.x]);
      return canvas.objmap[opt.y][opt.x] = null;
    } else {
      canvas.removeChild(canvas.chars[id]);
      return delete canvas.chars[id];
    }
  };

}).call(this);
