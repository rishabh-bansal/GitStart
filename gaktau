package com.blogspot.blogsetyaaji.androidlanjutan;

import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.support.v7.app.AppCompatActivity;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.Locale;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class SttActivity extends AppCompatActivity {

    @BindView(R.id.edTs)
    EditText edTs;
    @BindView(R.id.btnStt)
    Button btnStt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_stt);
        ButterKnife.bind(this);
    }

    @OnClick(R.id.btnStt)
    public void onViewClicked() {
        prosesSuara();
    }

    private void prosesSuara() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,new Locale("in","INA"));
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,"Start Speak");

        try {
            startActivity(intent, );
        }catch (Exception e){
            Toast.makeText(this, getString(R.string.tts_error), Toast.LENGTH_LONG);
        }
    }
}
