import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

@RestController
@RequestMapping("/api")
public class FirebaseController {

    @PostMapping("/add")
    public String addData(@RequestBody Map<String, Object> data) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            db.collection("usuarios").add(data);
            return "Dados salvos com sucesso!";
        } catch (Exception e) {
            return "Erro: " + e.getMessage();
        }
    }
}
