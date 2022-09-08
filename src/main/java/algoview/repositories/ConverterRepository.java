package algoview.repositories;

import algoview.models.Converter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConverterRepository extends MongoRepository<Converter, String> {
}
