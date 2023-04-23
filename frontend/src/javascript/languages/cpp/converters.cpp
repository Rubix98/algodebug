template <class A, class B>
std::ostream& operator<<(std::ostream& os, const std::pair<A,B>& p)
{
	os << p.first << " " << p.second << "\n";
	return os;
}
template <class A, class B, class C>
std::ostream& operator<<(std::ostream& os, const std::tuple<A,B,C>& t)
{
	os << std::get<0>(t) << " " << std::get<1>(t) << " " << std::get<2>(t) << "\n";
	return os;
}
template <class A>
std::ostream& operator<<(std::ostream& os, const std::vector<A>& v)
{
	for(auto e : v) os << e << "\n";
	return os;
}
