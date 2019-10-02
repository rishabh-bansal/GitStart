package scheduling;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

/**
 *
 * @author vietn
 */
public class ReadyQueue {

    private Process currentProcess;
    private ArrayList<Process> processes;
    private ArrayList<Process> results;

    public ReadyQueue() {
        this.processes = new ArrayList<Process>();
        this.results = new ArrayList<Process>();
    }

    public ReadyQueue(ArrayList<Process> processes) {
        this.processes = processes;
        this.results = new ArrayList<>(processes);
    }

    public void addProcess(Process newProcess) {
        this.processes.add(newProcess);
    }

    public void removeProcess() {
        int size = this.results.size();
        Process result = this.processes.remove(0);
        for (int i = 0; i < size; i++) {
            Process temp = this.results.get(i);
            if (temp.getId().equals(result.getId())) {
                this.results.remove(i);
                this.results.add(i, result);
            }
        }
//        try {
//            this.currentProcess = this.processes.get(0);
//        } catch (Exception e) {
//        }
    }

    public void startProcess(int time) {
        this.currentProcess = this.processes.get(0);
        this.processes.remove(this.currentProcess);
        this.currentProcess.start(time);
    }

    public void pauseProcess(int time) {
        this.currentProcess.pause(time);
        if (this.currentProcess.getAmount() > 0) {
            this.processes.add(this.currentProcess);
        }
    }

    public void sortQueue(Algorithm sortAlgorithm, int time) {
        this.processes = sortAlgorithm.sort(this.processes, this.currentProcess, time);
        this.currentProcess = this.processes.get(0);
    }

    public Process getCurrentProcess() {
        return currentProcess;
    }

    public void setCurrentProcess(Process currentProcess) {
        this.currentProcess = currentProcess;
    }

    public ArrayList<Process> getProcesses() {
        return processes;
    }

    public void setProcesses(ArrayList<Process> processes) {
        this.processes = processes;
    }

    public ArrayList<Process> getResults() {
        return results;
    }

    public void setResults(ArrayList<Process> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        String string = "";
        int size = this.results.size();
        for (int i = 0; i < size; i++) {
            string += this.results.get(i).toString()+ "\n";
        }
        return string;
    }

}
