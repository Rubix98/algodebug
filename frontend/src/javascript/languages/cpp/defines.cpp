#define ALGODEBUG_OBJECT(id, x) std::cout << "<algodebug-object " << "id=\"" << #id << "\">\n"; std::cout << x; std::cout << "\n</algodebug-object>\n"
#define ALGODEBUG_BREAKPOINT_START(line) std::cout << "<algodebug-breakpoint " << "line=\"" << line << "\">\n"
#define ALGODEBUG_BREAKPOINT_END() std::cout << "</algodebug-breakpoint>\n"
