package algoview.pojos;

import algoview.models.Converter;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SceneObject {
    Integer id;
    TypePojo type;
    MarkPojo variable;
    Converter converter;
    String color;
    List<SceneObject> subobjects;
}
