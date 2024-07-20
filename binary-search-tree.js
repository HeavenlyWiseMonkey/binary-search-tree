import mergeSort from './mergeSort.js'

class Node {
    constructor(data=null,left=null,right=null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}

class Tree {
    constructor(array) {
        this.array = array;
        this.root;
    }
    buildTree(start, end) {
        if (start>end) {
            return null;
        }
        const mid = Math.floor((start+end)/2);
        const root = new Node(this.array[mid]);
        root.left = this.buildTree(start, mid-1);
        root.right = this.buildTree(mid+1, end);
        return root;
    }
    filter() {
        this.array = Array.from(new Set(this.array));
        this.array = mergeSort(this.array);
    }
    filterTree() {
        this.filter();
        this.root = this.buildTree(0, this.array.length-1);
    }
    insert(value, cur=this.root) {
        if (!cur) {
            return new Node(value);
        }
        if (value>cur.data) {
            cur.right = this.insert(value, cur.right);
        }
        else if (value<cur.data) {
            cur.left = this.insert(value, cur.left);
        }
        return cur;
    }
    delete(value, cur=this.root) {
        if (!cur) {
            return cur;
        }
        if (value<cur.data) {
            cur.left = this.delete(value, cur.left);
            return cur;
        }
        else if (value>cur.data) {
            cur.right = this.delete(value, cur.right);
            return cur;
        }

        if (!cur.left) {
            return cur.right;
        }
        else if (!cur.right) {
            return cur.left;
        }

        let succParent = cur;
        let succ = cur.right;

        while (succ.left) {
            succParent = succ;
            succ = succ.left;
        }

        cur.data = succ.data;

        if (succParent.left===succ) {
            succParent.left = succ.right;
        }
        else {
            succParent.right = succ.left;
        }

        return cur;
    }
    find(value, cur=this.root) {
        if (!cur) {
            return null;
        }
        if (value===cur.data) {
            return cur;
        }
        else if (value<cur.data) {
            return this.find(value, cur.left);
        }
        else if (value>cur.data) {
            return this.find(value, cur.right);
        }
    }
    levelOrder(callback=null, cur=this.root) {
        if (!cur) {
            return;
        }
        const queue = [];
        const nodeArray = [];
        let point;
        queue.push(cur);
        while (queue.length) {
            point = queue[0];
            if (callback) {
                point = callback(point);
                console.log(point);
            }
            nodeArray.push(point.data);
            if (point.left) {
                queue.push(point.left);
            }
            if (point.right) {
                queue.push(point.right);
            }
            queue.shift();
        }
        if (!callback) {
            return nodeArray;
        }
    }
    preOrder(callback, cur=this.root) {
        const nodeArray = [];
        if (!cur) {
            return [];
        }
        if (callback) {
            cur = callback(cur);
            this.preOrder(callback, cur.left);
            this.preOrder(callback, cur.right);
            return;
        }
        nodeArray.push(cur.data);
        nodeArray.push(...this.preOrder(callback, cur.left));
        nodeArray.push(...this.preOrder(callback, cur.right));

        return nodeArray;
    }
    inOrder(callback, cur=this.root) {
        const nodeArray = [];
        if (!cur) {
            return [];
        }
        if (callback) {
            this.inOrder(callback, cur.left);
            cur = callback(cur);
            this.inOrder(callback, cur.right);
            return;
        }
        nodeArray.push(...this.inOrder(callback, cur.left));
        nodeArray.push(cur.data);
        nodeArray.push(...this.inOrder(callback, cur.right));

        return nodeArray;
    }
    postOrder(callback, cur=this.root) {
        const nodeArray = [];
        if (!cur) {
            return [];
        }
        if (callback) {
            this.postOrder(callback, cur.left);
            this.postOrder(callback, cur.right);
            cur = callback(cur);
            return;
        }
        nodeArray.push(...this.postOrder(callback, cur.left));
        nodeArray.push(...this.postOrder(callback, cur.right));
        nodeArray.push(cur.data);

        return nodeArray;
    }
    height(node) {
        if (!node) {
            return null;
        }
        let leftHeight = this.height(node.left);
        let rightHeight = this.height(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }
    depth(node, cur=this.root) {
        let level = 0;
        if (!node) {
            return null;
        }
        if (node.data<cur.data) {
            level += this.depth(node, cur.left) + 1;
        }
        else if (node.data>cur.data) {
            level += this.depth(node, cur.right) + 1;
        }
        return level;
    }
    isBalanced(cur=this.root) {
        if (!cur) {
            return true;
        }
        let leftHeight = this.height(cur.left);
        let rightHeight = this.height(cur.right);
        return (Math.abs(leftHeight-rightHeight) < 2 && this.isBalanced(cur.left) && this.isBalanced(cur.right)); 
    }
    rebalance() {
        let nodeArray = this.inOrder();
        this.array = nodeArray;
        this.filterTree();
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

function randomNums(length) {
    let array = [];
    for (let i=0; i<length; i++) {
        array.push(Math.floor(Math.random() * 100));
    }
    return array;
}

// function plusOne(num) {
//     num.data += 1;
//     return num;
// }

let array = randomNums(16);
const binaryTree = new Tree(array);
binaryTree.filterTree();
prettyPrint(binaryTree.root);
console.log(binaryTree.isBalanced());
console.log(binaryTree.levelOrder());
console.log(binaryTree.preOrder());
console.log(binaryTree.inOrder());
console.log(binaryTree.postOrder());
binaryTree.insert(101);
binaryTree.insert(102);
console.log(binaryTree.isBalanced());
binaryTree.rebalance();
console.log(binaryTree.isBalanced());
console.log(binaryTree.levelOrder());
console.log(binaryTree.preOrder());
console.log(binaryTree.inOrder());
console.log(binaryTree.postOrder());
prettyPrint(binaryTree.root);

// const testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// const test = new Tree(testArray);
// test.filterTree();
// test.insert(10);
// test.insert(11);
// test.delete(10);
// console.log(test.find(4));
// console.log(test.levelOrder(plusOne));
// console.log(test.preOrder(plusOne));
// console.log(test.height(test.root.left.left));
// console.log(test.depth(test.root.left.left.right));
// console.log(test.isBalanced());
// test.rebalance();
// prettyPrint(test.root);

