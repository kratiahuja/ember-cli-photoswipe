/* jshint node: true */
'use strict';

var fs   = require('fs');
var path = require('path');
var Funnel = require('broccoli-funnel');
var Merge = require('broccoli-merge-trees');
var existsSync = require('exists-sync');
var fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-cli-photoswipe',

  included: function(app) {
    this.app  = app;
    var psDir = app.bowerDirectory + '/photoswipe';
    app.import(psDir + '/dist/photoswipe.css');
    app.import(psDir + '/dist/default-skin/default-skin.css');

    console.log(psDir);
    app.import('vendor/photoswipe/photoswipe.js');
    app.import('vendor/photoswipe/photoswipe-ui-default.min.js');
  },

  treeForVendor: function(tree) {
    var trees = [];

    if (tree) {
      trees.push(tree);
    }

    var photoswipePath = path.join(this.app.bowerDirectory, 'photoswipe', 'dist');

    if (existsSync(photoswipePath)) {
      var photoSwipeTrees = fastbootTransform(new Funnel(photoswipePath, {
        files: ['photoswipe.js', 'photoswipe-ui-default.min.js'],
        destDir: 'photoswipe'
      }));

      trees.push(photoSwipeTrees);
    }

    return new Merge(trees);
  },

  treeForPublic: function() {
    var svgPath = path.join(this.app.bowerDirectory, 'photoswipe', 'dist', 'default-skin');
    var publicTree = new Funnel(this.treeGenerator(svgPath), {
      srcDir: '/',
      destDir: '/assets',
      exclude: ['default-skin.css']
    });
    return publicTree;
  }
};
