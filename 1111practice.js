// Problem: Given an array containing a post-order traversal of a BST,
// turn it back into a BST

class Bst {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

function postToBst(arr) {}

// console.dir with depth set to null stops Node from truncating the output
console.dir(postToBst([8, 12, 10, 16, 25, 20, 15]), { depth: null });
console.dir(postToBst([]), { depth: null });
