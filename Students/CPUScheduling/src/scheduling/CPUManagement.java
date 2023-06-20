package scheduling;

import java.util.ArrayList;
import java.util.Arrays;

/**
 *
 * @author vietn
 */
public class CPUManagement {

    private int time;
    private Algorithm sortAlgorithm;
    private ReadyQueue readyQueue;

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public CPUManagement(Process[] processes, Algorithm algorithm) {
        this.time = 0;
        this.readyQueue = new ReadyQueue(new ArrayList<Process>(Arrays.asList(processes)));
        this.sortAlgorithm = algorithm;
    }

    public CPUManagement(Process[] processes, Algorithm algorithm, int time) {
        this.time = time;
        this.readyQueue = new ReadyQueue(new ArrayList<Process>(Arrays.asList(processes)));
        this.sortAlgorithm = algorithm;
    }

    public void interrupt() {
        this.readyQueue.sortQueue(this.sortAlgorithm, this.time);

        this.readyQueue.startProcess(this.time);
        int stopTime = sortAlgorithm.interrupt(this.readyQueue.getProcesses(), this.readyQueue.getCurrentProcess(), this.time);
        this.readyQueue.pauseProcess(stopTime);

        this.time = stopTime;
    }

    public ReadyQueue getReadyQueue() {
        return readyQueue;
    }

    public void setReadyQueue(ReadyQueue readyQueue) {
        this.readyQueue = readyQueue;
    }

    @Override
    public String toString() {
        return this.readyQueue.toString();
    }

    public Algorithm getSortAlgorithm() {
        return sortAlgorithm;
    }

    public void setSortAlgorithm(Algorithm sortAlgorithm) {
        this.sortAlgorithm = sortAlgorithm;
    }

    public void execute() {
        this.getReadyQueue().sortQueue(this.getSortAlgorithm(), this.getTime());
        while (this.getReadyQueue().getProcesses().size() > 0) {
            this.interrupt();
        }
    }
}
