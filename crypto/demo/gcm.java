import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AES_GCM_Example
{
    static String plainText = "This is a plain text which need to be encrypted by Java AES 256 GCM Encryption Algorithm";
    public static final int AES_KEY_SIZE = 256;
    public static final int GCM_IV_LENGTH = 12;
    public static final int GCM_TAG_LENGTH = 16;

    public static void main(String[] args) throws Exception
    {
        // KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        // keyGenerator.init(AES_KEY_SIZE);
       
        // Generate Key
        // SecretKey key = keyGenerator.generateKey();
        
        byte[] encodedKey = "3siCmpuTiiKvUEbjdQxiDY801pGpM68p".getBytes();
        SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
        System.out.println("Secret key : " + key);
        
        // byte[] IV = new byte[GCM_IV_LENGTH];
        // SecureRandom random = new SecureRandom();
        // random.nextBytes(IV);
        byte[] IV = "f42c98ab7acb50b805669223".getBytes();

        System.out.println("Original Text : " + plainText);
        
        //byte[] cipherText = encrypt(plainText.getBytes(), key, IV);
        //System.out.println("Encrypted Text : " + Base64.getEncoder().encodeToString(cipherText));
        
        String cipherText = encrypt(plainText.getBytes(), key, IV);
        System.out.println("Encrypted Text : " + cipherText);
        
        String decryptedText = decrypt(cipherText, key, IV);
        System.out.println("DeCrypted Text : " + decryptedText);
    }

    public static String encrypt(byte[] plaintext, SecretKey key, byte[] IV) throws Exception
    {
        // Get Cipher Instance
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        
        // Create SecretKeySpec
        SecretKeySpec keySpec = new SecretKeySpec(key.getEncoded(), "AES");
        
        // Create GCMParameterSpec
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, IV);
        
        // Initialize Cipher for ENCRYPT_MODE
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmParameterSpec);
        
        byte[] aad = "zLPDdNd6BdCsP2fx74KbQsnCRsx9qjgU".getBytes();
        cipher.updateAAD(aad);
        
        // Perform Encryption
        byte[] cipherText = cipher.doFinal(plaintext);
        
         byte[] d = addBytes(IV, cipherText);
        
        
        return Base64.getEncoder().encodeToString(d);
    }

    public static String decrypt(String cc, SecretKey key, byte[] IV) throws Exception
    {
        byte[] cipherText = Base64.getDecoder().decode(cc);
        
        // Get Cipher Instance
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        
        // Create SecretKeySpec
        SecretKeySpec keySpec = new SecretKeySpec(key.getEncoded(), "AES");
        
        // Create GCMParameterSpec
        GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, IV);
        
        // Initialize Cipher for DECRYPT_MODE
        cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmParameterSpec);
        
        byte[] aad = "zLPDdNd6BdCsP2fx74KbQsnCRsx9qjgU".getBytes();
        cipher.updateAAD(aad);
        
        // Perform Decryption
        byte[] decryptedText = cipher.doFinal(cipherText);
        
        return new String(decryptedText);
    }
    
    public static byte[] addBytes(byte[] data1, byte[] data2) { 
        byte[] data3 = new byte[data1.length + data2.length]; 
        System.arraycopy(data1, 0, data3, 0, data1.length); 
        System.arraycopy(data2, 0, data3, data1.length, data2.length); 
        return data3; 
  
    } 
}