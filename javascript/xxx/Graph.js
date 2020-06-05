export default class Graph {
	/**
	 * 图： 顶点/边/度
	 * 有向图/无向图
	 * 邻接矩阵/逆邻接矩阵
	 * 深度优先/广度优先
	*/
	constructor(isDirected = false) {
		this.vertices = {};
		this.edges = {};
		this.isDirected = isDirected;
	}

	/**
	 * 新增顶点
	 * @param {GraphVertex} newVertex
	 * @returns {Graph}
	*/
	addVertex(newVertex) {
		this.vertices[newVertex.getKey()] = newVertex;
		return this;
	}

	/**
	 * 通过vertexKey获取图中的顶点
	 * @param {string} vertexKey
	 * @returns GraphVertex
	*/
	getVertexByKey(vertexKey) {
		return this.vertices[vertexKey];
	}

	/**
	 * 找出一个顶点的关系(邻居)
	 * @param {GraphVertex}
	 * @returns {GraphVertex[]}
	*/
	getNeighbors(vertex) {
		return vertex.getNeighbors();
	}

	/**
	 * 列出图中所有的顶点
	 * @returns {GraphVertex[]}
	*/
	getAllVertices() {
		return Object.values(this.vertices);
	}

	/**
	 * 列出图中所有的边
	 * @returns {GraphEdge[]}
	*/
	getAllEdges() {
		return Object.values(this.edges);
	}

	/**
	 * 新增一条边
	 * @params {GraphEdge} edge
	 * @returns {Graph}
	*/
	addEdge(edge) {
		// 1. 通过边找起始/结束顶点
		let startVertex = this.getVertexByKey(edge.startVertex.getKey());
		let endVertex = this.getVertexByKey(edge.endVertex.getKey());

		// 2. 开始顶点是否存在，不存在新增
		if (!startVertex) {
			this.addVertex(startVertex);
			startVertex = this.getVertexByKey(edge.startVertex.getKey());
		}

		// 3. 结束顶点是否存在，不存在新增
		if (!endVertex) {
			this.addVertex(endVertex)
			endVertex = this.getVertexByKey(edge.endVertex.getKey());
		}

		// 4. 检查edge是否在图中
		if (this.edges[edge.getKey()]) {
			throw new Error('edge has already in graph')
		} else {
			this.edges[edge.getKey()] = edge;
		}

		// 5. 把edge关联vertex
		if (this.isDirected) {
			startVertex.addEdge(edge);
		} else {
			// 如果是无向图，则将edge关联起始/结束顶点，否则只需关联起始顶点
			startVertex.addEdge(edge);
			endVertex.addEdge(edge);
		}

		return this;
	}

	/**
	 * 删除一个边
	 * @param {GraphEdge} edge
	*/
	deleteEdge(edge) {
		// 1. 图edges删除
		if (this.edges[edge.getKey()]) {
			delete this.edges[edge.getKey];
		} else {
			throw new Error('no edge in graph')
		}

		// 2. 起始顶点和结束顶点删除
		const startVertex = this.getVertexByKey(edge.startVertex.getKey());
		startVertex.deleteEdge(edge);

		const endVertex = this.getVertexByKey(edge.endVertex.getKey());
		endVertex.deleteEdge(edge);
	}

	/**
	 * 查询两个顶点之间的边
	 * @param {GraphVertex} startVertex
	 * @param {GraphVertex} endVertex
	 * @returns {GraphEdge|null}
	*/
	findEdge(startVertex, endVertex) {
		const vertex = this.getVertexByKey(startVertex.getKey());

		if (!vertex) {
			return null;
		}

		return vertex.findEdge(endVertex);
	}

	/**
	 * @return {number}
	*/
	getWeight() {
		return this.getAllEdges().reduce(weight, graphEdge) => {
			return weight + graphEdge.weight;
		}
	}
}