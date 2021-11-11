const Queue = require("./Queue");

class BinarySearchTree {
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    // If the tree is empty, then this key being inserted is the root node of the tree.
    if (this.key == null) {
      this.key = key;
      this.value = value;
    } else if (key < this.key) {
      /* If the tree already exists, then start at the root,
       and compare it to the key that you want to insert.
       If the new key is less than the node's key,
       then the new node needs to live in the left-hand branch. */
      /* If the existing node does not have a left child,
           meaning that the `left` pointer is empty,
           then you can just instantiate and insert the new node
           as the left child of that node, passing `this` as the parent. */
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      } else {
        /* If the node has an existing left child,
           then you recursively call the `insert()` method
           so that the node is added further down the tree. */
        this.left.insert(key, value);
      }
    } else {
      /* Similarly, if the new key is greater than the node's key,
       then you do the same thing, but on the right-hand side. */
      if (this.right == null) {
        this.right = new BinarySearchTree(key, value, this);
      } else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    // If the item is found at the root, then return that value.
    if (this.key == key) {
      return this.value;
    } else if (key < this.key && this.left) {
      /* If the item that you are looking for is less than the root,
       then follow the left child.
       If there is an existing left child,
       then recursively check its left and/or right child
       until you find the item. */
      return this.left.find(key);
    } else if (key > this.key && this.right) {
      /* If the item that you are looking for is greater than the root,
       then follow the right child.
       If there is an existing right child,
       then recursively check its left and/or right child
       until you find the item. */
      return this.right.find(key);
    }
    // You have searched the tree, and the item isn't in the tree.
    else {
      throw new Error("Key Not Found");
    }
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      } else if (this.left) {
        /* If the node only has a left child,
           then you replace the node with its left child. */
        this._replaceWith(this.left);
      } else if (this.right) {
        /* And similarly, if the node only has a right child,
           then you replace it with its right child. */
        this._replaceWith(this.right);
      } else {
        /* If the node has no children, then
           simply remove it and any references to it
           by calling `this._replaceWith(null)`. */
        this._replaceWith(null);
      }
    } else if (key < this.key && this.left) {
      this.left.remove(key);
    } else if (key > this.key && this.right) {
      this.right.remove(key);
    } else {
      throw new Error("Key Not Found");
    }
  }

  _replaceWith(node) {
    if (this.parent) {
      if (this == this.parent.left) {
        this.parent.left = node;
      } else if (this == this.parent.right) {
        this.parent.right = node;
      }

      if (node) {
        node.parent = this.parent;
      }
    } else {
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      } else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin();
  }

  dfsInOrder(values = []) {
    // first, process left node recursively
    if (this.left) {
      values = this.left.dfsInOrder(values);
    }

    // next, process current node
    values.push(this.value);

    // finally, process right node recursively
    if (this.right) {
      values = this.right.dfsInOrder(values);
    }

    return values;
  }

  dfsPreOrder(values = []) {
    // first, process current node
    values.push(this.value);

    // next, process left node recursively
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }

    // finally, process right node recursively
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }

    return values;
  }

  dfsPostOrder(values = []) {
    // first, process left node recursively
    if (this.left) {
      values = this.left.dfsPostOrder(values);
    }

    // next, process right node recursively
    if (this.right) {
      values = this.right.dfsPostOrder(values);
    }

    // finally, process current node
    values.push(this.value);

    return values;
  }

  bfs(tree, values = []) {
    const queue = new Queue();
    queue.enqueue(tree); // start the traversal at the tree, and add the tree node to the queue to kick off the BFS
    let node = queue.dequeue(); // remove from the queue
    while (node) {
      values.push(node.value); // add that value from the queue to array

      if (node.left) {
        queue.enqueue(node.left); // add left child to queue
      }
      if (node.right) {
        queue.enqueue(node.right); // add right child to queue
      }
      node = queue.dequeue();
    }
    return values;
  }

  getHeight(currentHeight = 0) {
    // BASE CASE:
    // If the current node doesn't have a left or right child,
    // then the base case is reached, and the function can return the height
    if (!this.left && !this.right) return currentHeight;

    // RECURSIVE CASE:
    // Otherwise, compute the new height
    const newHeight = currentHeight + 1;

    // If there's no left child, recurse down the right subtree only,
    // passing down the height of the current node.
    if (!this.left) return this.right.getHeight(newHeight);

    // If there,s no right child, recurse down the left subtree only,
    // passing down the height of the current node
    if (!this.right) return this.left.getHeight(newHeight);

    // If both children exist, recurse down both subtrees,
    // passing down the height of the current node
    const leftHeight = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);

    // Return the greater of the left or right subtree heights
    return Math.max(leftHeight, rightHeight);
  }

  isBST() {
    // Use the existing 'dfsInOrder()' method to traverse the tree
    const values = this.dfsInOrder();

    // Check if the array returned by the in-order DFS is a sorted array
    for (let i = 1; i < values.length; i++) {
      // compare the current and previous values
      if (values[i] < values[i - 1]) {
        return false;
      }
    }
    return true;
  }

  findKthLargestValue(k) {
    // Use the existing 'dfsInOrder()' method to traverse the tree
    const values = this.dfsInOrder();
    const kthIndex = values.length - k;

    // Ensure that the index is within the bounds of the array
    if (kthIndex >= 0) {
      return values[kthIndex];
    } else {
      console.error("k value exceeds the size of the BST.");
    }
  }
}
