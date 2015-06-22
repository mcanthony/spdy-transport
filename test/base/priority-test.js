var assert = require('assert');

var transport = require('../../');

describe('Stream Priority tree', function() {
  var tree;
  beforeEach(function() {
    tree = transport.Priority.create();
  });

  it('should create basic tree', function() {
    //                   0
    //     [1 p=2]    [2 p=4]    [3 p=2]
    // [4 p=2] [5 p=2]

    tree.add({ id: 1, parent: 0, weight: 2 });
    tree.add({ id: 5, parent: 1, weight: 2 });
    tree.add({ id: 2, parent: 0, weight: 4 });
    tree.add({ id: 3, parent: 0, weight: 2 });
    tree.add({ id: 4, parent: 1, weight: 2 });

    // Results
    assert.deepEqual([ 1, 2, 3, 4, 5 ].map(function(id) {
      return tree.get(id).priority;
    }), [ 0.25, 0.5, 0.25, 0.125, 0.125 ]);
  });

  it('should create default node on error', function() {
    var node = tree.add({ id: 1, parent: 1 });
    assert.equal(node.parent.id, 0);
    assert.equal(node.weight, tree.defaultWeight);

    var node = tree.add({ id: 1, parent: 3 });
    assert.equal(node.parent.id, 0);
    assert.equal(node.weight, tree.defaultWeight);
  });

  it('should remove empty node', function() {
    var node = tree.add({ id: 1, parent: 0, weight: 1 });
    assert(tree.get(1) !== undefined);
    node.remove();
    assert(tree.get(1) === undefined);
  });

  it('should move children to parent node on removal', function() {
    // Tree from the first test
    var one = tree.add({ id: 1, parent: 0, weight: 2 });
    tree.add({ id: 5, parent: 1, weight: 2 });
    tree.add({ id: 2, parent: 0, weight: 4 });
    tree.add({ id: 3, parent: 0, weight: 2 });
    tree.add({ id: 4, parent: 1, weight: 2 });

    one.remove();
    assert(tree.get(1) === undefined);

    assert.deepEqual([ 2, 3, 4, 5 ].map(function(id) {
      return tree.get(id).priority;
    }), [ 0.4, 0.2, 0.2, 0.2 ]);
  });
});