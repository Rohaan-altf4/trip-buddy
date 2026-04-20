import type { Friend } from "@/lib/settle";

type Props = {
  friends: Friend[];
  nameInput: string;
  setNameInput: (v: string) => void;
  addFriend: () => void;
  removeFriend: (id: string) => void;
};

export default function FriendsCard({
  friends,
  nameInput,
  setNameInput,
  addFriend,
  removeFriend,
}: Props) {
  return (
    <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-card border border-card-border animate-slide-up">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">
          <span className="text-primary-glow mr-2">Step 1</span> Add Friends
        </h2>
        <span className="text-xs text-muted-foreground">{friends.length} added</span>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addFriend()}
          placeholder="Friend's name"
          className="flex-1 rounded-lg bg-input text-input-foreground placeholder:text-muted-foreground px-4 py-3 outline-none focus:ring-2 focus:ring-ring border border-card-border min-h-[44px]"
        />
        <button
          type="button"
          onClick={addFriend}
          className="rounded-lg bg-primary text-primary-foreground px-5 py-3 font-medium hover:bg-primary-glow transition-colors min-h-[44px]"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {friends.map((f) => (
          <span
            key={f.id}
            className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary-glow px-3 py-1.5 text-sm font-medium animate-spring-in border border-primary/20"
          >
            {f.name}
            <button
              type="button"
              onClick={() => removeFriend(f.id)}
              className="hover:text-danger transition-colors"
              aria-label={`Remove ${f.name}`}
            >
              ✕
            </button>
          </span>
        ))}
        {friends.length === 0 && (
          <p className="text-sm text-muted-foreground">No friends yet — add at least 2 to start.</p>
        )}
      </div>
      {friends.length < 2 && friends.length > 0 && (
        <p className="mt-3 text-xs text-danger">Add at least 2 friends to continue.</p>
      )}
    </section>
  );
}
