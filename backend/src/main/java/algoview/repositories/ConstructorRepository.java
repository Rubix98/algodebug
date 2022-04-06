package algoview.repositories;

import algoview.models.Constructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructorRepository extends MongoRepository<Constructor, String> {
}
