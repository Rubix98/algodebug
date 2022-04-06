#include <iostream>
#include <vector>
#include <string>

const std::string ALGO_FIRST_SEPARATOR = " ";
const std::string ALGO_SECOND_SEPARATOR = "|";

std::string algoPrint(std::string name, std::string type, std::string value) {
    char *result;
    sprintf(result, "<var name='%s' type='%s' value='%s'", name.c_str(), type.c_str(), value.c_str());
    return std::string(result);
}

class AlgoEdge {
public:
  int a, b;
  double w;

  AlgoEdge(){}

  /*<ALGOEDGE-CONSTRUCTOR>*/

  AlgoEdge(int a, int b, double w) {
    this->a = a;
    this->b = b;
    this->w = w;
  }

  std::string toString() {
    return std::to_string(this->a) + ALGO_FIRST_SEPARATOR + std::to_string(this->b) + ALGO_FIRST_SEPARATOR + std::to_string(this->w);
  }
};

class AlgoGraph {
public:
  std::vector<AlgoEdge> edges;

  AlgoGraph() {}

  /*<ALGOGRAPH-CONSTRUCTOR>*/

  void addEdge(int a, int b, double w) {
    this->edges.push_back(AlgoEdge(a, b, w));
  }

  std::string toString() {
    std::string result = "";
    for (AlgoEdge edge: this->edges) {
        result += edge.toString() + (result != "" ? ALGO_SECOND_SEPARATOR : "");
    }
    return result;
  }
};

class AlgoPoint {
public:
  double x, y;

  AlgoPoint(){}

  /*<ALGOPOINT-CONSTRUCTOR>*/

  AlgoPoint(double x, double y) {
    this->x = x;
    this->y = y;
  }

  std::string toString() {
    return std::to_string(this->x) + ALGO_FIRST_SEPARATOR + std::to_string(this->y);
  }
};

class AlgoLine {
public:
  AlgoPoint a, b;

  /*<ALGOLINE-CONSTRUCTOR>*/

  AlgoLine(AlgoPoint a, AlgoPoint b) {
    this->a = a;
    this->b = b;
  }

  AlgoLine(double x1, double y1, double x2, double y2) {
    this->a = AlgoPoint(x1, y1);
    this->b = AlgoPoint(x2, y2);
  }

  std::string toString() {
    return this->a.toString() + ALGO_SECOND_SEPARATOR + this->b.toString();
  }
};

