package algodebug.logic.project.pojos;

import algodebug.logic.converter.Converter;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
public class SceneObject {
    Integer id;
    TypePojo type;
    VariablePojo variable;
    Converter converter;
    String color;
    List<SceneObject> subobjects;
    HashMap<String, PointPojo> position;
}
