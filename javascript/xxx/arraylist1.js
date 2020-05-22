class MyLinkedList {
    constructor() {
        this.head = null
        this.len = 0
    }

    addAtHead(val) {
        if (this.len === 0) {
            this.head = new Node(val, null)
        } else {
            let n = this.head.next
            this.head = new Node(val, n)
        }

        this.len++
    }

    addAtTail(val) {
        if (this.len === 0) {
            this.head = new Node(val, null)
        } else {
            let node = new Node(val, null)
            let preNode = this._getNode(this.head, 0, this.len - 1)
            preNode.setNext(node)
        }

        this.len++
    }

    addAtIndex(index, val) {
        if (index > this.len) return

        if (index === this.len) {
            return this.addAtTail(val)
        }

        if (index <= 0) {
            return this.addAtHead(val)
        }

        let preNode = this._getNode(this.head, 0, index - 1)
        let current = new Node(val, preNode.next)
        preNode.setNext(current)
        this.len++
        return
    }

    get(index) {
        if (index > this.len - 1) return -1
        if (this.len == 0) return -1
        return this._getNode(this.head, 0, index).val
    }

    deleteAtIndex(index) {
        if (index > this.len - 1) return

        if (index === 0) {
            this.head = this.head.next
        }

        if (index === this.len - 1) {
            let preNode = this._getNode(this.head, 0, this.len - 1)
            preNode.setNext(null)
        }

        let preNode = this._getNode(this.head, 0, index - 1)
        let current = preNode.next
        let nextNode = current.next
        console.log(nextNode)
        preNode.setNext(nextNode)
        this.len--
    }

    _getNode(node, i, index) {
        if (i === index) {
            return node
        } else {
            return this._getNode(node.next, ++i, index)
        }
    }
}

class Node {
    constructor(val, node) {
        this.val = val
        this.next = node
    }

    setNext(node) {
        this.next = node
    }
}

let list = new MyLinkedList();
list.addAtHead(1)
console.log(1, list)
list.addAtTail(3)
console.log(2, list)
list.addAtIndex(1, 2)
list.addAtIndex(1, 4)
console.log(3, list)
list.deleteAtIndex(1)
console.log(5, list);

