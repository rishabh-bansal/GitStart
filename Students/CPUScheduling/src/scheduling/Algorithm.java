/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scheduling;

import java.util.ArrayList;
import java.util.Comparator;

/**
 *
 * @author vietn
 */
public interface Algorithm {

    ArrayList<Process> sort(ArrayList<Process> processes, Process currentProcess, int currentTime);

    int interrupt(ArrayList<Process> processes, Process currentProcess, int currentTime);
}
