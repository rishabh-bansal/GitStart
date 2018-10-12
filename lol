<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context="com.blogspot.ammar221.androidlanjutan.SmsActivity">

    <EditText
        android:id="@+id/edSmsTo"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="number"
        android:hint="@string/Send_To"/>


    <EditText
        android:id="@+id/edSmsPesan"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="textMultiLine"
        android:lines="5"
        android:hint="@string/pesan"/>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <Button
            android:id="@+id/btnSmsIntent"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/intent_send"
            android:layout_weight="1"/>

        <Button
            android:id="@+id/btnSmsKirim"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@string/btn_send"
            android:layout_weight="1"/>
    </LinearLayout>
</LinearLayout>
