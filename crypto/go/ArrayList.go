package main

import "fmt"

type LinkListNode struct {
	value interface{}
	next  *LinkListNode
}

func (node *LinkListNode) ToString() string {
	return fmt.Sprintf("%s", node.value)
}

type LinkList struct {
	head *LinkListNode
	tail *LinkListNode
}

func (l *LinkList) AddHead(value interface{}) {
	newNode := &LinkListNode{value, l.head}
	l.head = newNode

	if l.tail == nil {
		l.tail = newNode
	}
}

func (l *LinkList) AddTail(value interface{}) {
	newNode := &LinkListNode{value, l.head}

	l.tail.next = newNode
	l.tail = newNode

	if l.head == nil {
		l.head = newNode
	}
}

func (l *LinkList) DeleteHead() *LinkListNode {
	if l.head == nil {
		return nil
	}

	deletedLinkListNode := l.head
	if l.head.next != nil {
		l.head = l.head.next
	} else {
		l.head = nil
		l.tail = nil
	}

	return deletedLinkListNode
}

func (l *LinkList) DeleteTail() *LinkListNode {
	deletedTail := l.tail

	if l.head == l.tail {
		l.head = nil
		l.tail = nil
		return deletedTail
	}

	currentNode := l.head
	for currentNode.next != nil {
		if currentNode.next.next == nil {
			currentNode.next = nil
		} else {
			currentNode = currentNode.next
		}
	}

	l.tail = currentNode
	return deletedTail
}

func (l *LinkList) Find(value interface{}) {

}
