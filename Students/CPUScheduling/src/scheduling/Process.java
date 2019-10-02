package scheduling;

import java.util.ArrayList;
import java.util.UUID;

/**
 *
 * @author vietn
 */
public class Process {

    private UUID id;
    private boolean isStarted;
    private int startTime;
    private int amount;
    private int responseTime;
    private int waitingTime;
    private ArrayList<int[]> session;

    public Process(int amount, int startTime) {
        this.id = UUID.randomUUID();
        this.startTime = startTime;
        this.amount = amount;
        this.isStarted = false;
        this.session = new ArrayList<int[]>();
    }

    public Process(int amount) {
        this.id = UUID.randomUUID();
        this.startTime = 0;
        this.amount = amount;
        this.isStarted = false;
        this.session = new ArrayList<int[]>();
    }

    public Process(Process process) {
        this.id = process.id;
        this.startTime = process.startTime;
        this.amount = process.amount;
        this.isStarted = process.isStarted;
        this.session = new ArrayList<>(process.session);
    }

    @Override
    public String toString() {
        String string = "";
        for (int i = 0; i < this.session.size(); i++) {
            string += this.toStringASession(i);
        }
        return string;
    }

    public String toStringASession(int index) {
        int[] currentSession = this.session.get(index);
        return "[" + String.valueOf(currentSession[0]) + ", " + String.valueOf(currentSession[1]) + "], ";
    }

    public void start(int time) {
        if (!this.isStarted) {
            this.isStarted = true;
        }

        //start new session
        int[] newSession = new int[2];
        newSession[0] = time;
        this.session.add(newSession);
    }

    public void pause(int time) {
        int currentIndex = this.session.size() - 1;
        int[] currentSession = this.session.get(currentIndex);
        currentSession[1] = time;
        this.session.remove(currentIndex);
        this.session.add(currentSession);

        this.calculateAmountTime();
    }

    public int calculateResponseTime() {
        int[] firstSession = this.session.get(0);
        this.responseTime = firstSession[0] - this.startTime;
        return this.responseTime;
    }

    public int calculateWaitingTime() {
        int waitingAmongSession = 0;
        for (int i = 1; i < this.session.size(); i++) {
            waitingAmongSession += this.session.get(i)[0] - this.session.get(i - 1)[1];
        }

        this.waitingTime = waitingAmongSession + this.calculateResponseTime();
        return this.waitingTime;
    }

    public int calculateAmountTime() {
        int currentIndex = this.session.size() - 1;
        int[] currentSession = this.session.get(currentIndex);
        this.amount -= currentSession[1] - currentSession[0];
        return this.amount;
    }

    public int calculateTurnAroundTime() {
        int endTime = this.session.get(this.session.size() - 1)[1];
        return endTime - this.startTime;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(int responseTime) {
        this.responseTime = responseTime;
    }

    public int getWaitingTime() {
        return waitingTime;
    }

    public void setWaitingTime(int waitingTime) {
        this.waitingTime = waitingTime;
    }

    public ArrayList<int[]> getSession() {
        return session;
    }

    public void setSession(ArrayList<int[]> session) {
        this.session = session;
    }

}
