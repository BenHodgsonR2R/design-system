/**
 * How loud a widget is.
 * @group Widgets
 */
export type Volume = "quiet" | "loud";

/**
 * The props for {@link Widget}.
 * @group Widgets
 */
export type WidgetProps = {
  /** How loud it is. */
  volume?: Volume;
  label: string;
};

/**
 * A widget.
 * @group Widgets
 */
export function Widget({ volume, label }: WidgetProps): string {
  return `${label}:${volume ?? "quiet"}`;
}

/**
 * The options for {@link Machine}.
 * @group Machines
 */
export type MachineOptions = { volume: Volume };

/**
 * Something that runs.
 * @group Machines
 */
export interface Runner {
  /** Runs once. */
  run(request: { times: number }): Promise<number>;
}

/**
 * A machine.
 * @group Machines
 */
export class Machine implements Runner {
  /** How loud it runs. */
  readonly volume: Volume;

  /** Makes a machine. */
  constructor({ volume }: MachineOptions) {
    this.volume = volume;
  }

  /** Runs the machine. */
  async run({ times }: { times: number }): Promise<number> {
    return times;
  }
}

/**
 * What went wrong.
 * @group Machines
 */
export class MachineError extends Error {
  /** Why it failed. */
  readonly reason: string;

  constructor(message: string, reason: string) {
    super(message);
    this.reason = reason;
  }
}
