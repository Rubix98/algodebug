#include <iostream>
#include <list>
#include <string>

const std::string ALGO_FIRST_SEPARATOR = " ";
const std::string ALGO_SECOND_SEPARATOR = "|";

class Object {

};

class Variable: Object {
std::string value;

public:
  Variable(){}

  Variable(std::string value) {
    this->value = value;
  }

  Variable(int value) {
    this->value = std::to_string(value);
  }

  std::string getType() {
    return "Variable";
  }

  std::string toString() {
    return value;
  }
};


class Edge: Object {
  int a, b;
  double w;

public:
  Edge(){}

  Edge(int a, int b, double w) {
    this->a = a;
    this->b = b;
    this->w = w;
  }

  std::string getType() {
    return "Edge";
  }

  std::string toString() {
    return std::to_string(a) + ALGO_FIRST_SEPARATOR + std::to_string(b) + ALGO_FIRST_SEPARATOR + std::to_string(w);
  }
};

class Graph: Object {
  std::list<Edge> edges;

public:
  Graph() {}

  void addEdge(int a, int b, double w) {
    this->edges.push_back(Edge(a, b, w));
  }

  std::string getType() {
    return "Graph";
  }

  std::string toString() {
    std::string result = "";
    for (Edge edge: edges) {
        result += edge.toString() + (result != "" ? ALGO_SECOND_SEPARATOR : "");
    }
    return result;
  }
};

struct VariableData {
    std::string name, type, value;

    VariableData(std::string name, std::string type, std::string value) {
        this->name = name;
        this->type = type;
        this->value = value;
    }

    std::string toString() {
        return "\t<algo-variable name='" + name + "' type='" + type + "' value='" + value + "' />\n";
    }
};

void algoPrint(std::list<VariableData> variables) {
    std::string breakpointMessage = "";
    breakpointMessage += "<algo-breakpoint>\n";
    for (VariableData variable: variables) {
        breakpointMessage += variable.toString();
    }
    breakpointMessage += "</algo-breakpoint>\n";
    std::cout << breakpointMessage;
}


