class MyLinkedList {
    constructor() {
        this.head = null
        this.len = 0
    }

    addAtHead(val) {
        if (this.len === 0) {
            this.head = new Node(val, null, null)
        } else {
            let n = this.head.next
            let head = new Node(val, null, n)
            n.setPre(head)
            this.head = head
        }

        this.len++
    }

    addAtTail(val) {
        if (this.len === 0) {
            this.head = new Node(val, null, null)
        } else {
            let node = new Node(val, null, null)
            let preNode = this._getNode(this.head, 0, this.len - 1)
            preNode.setNext(node)
            node.setPre(preNode)
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
        let current = new Node(val, preNode, preNode.next)
        preNode.next.setPre(current)
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
        preNode.setNext(current.next)
        nextNode.setPre(current.pre)
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
    constructor(val, preNode, nextNode) {
        this.val = val
        this.pre = preNode
        this.next = nextNode
    }

    setPre(node) {
        this.pre = node
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

