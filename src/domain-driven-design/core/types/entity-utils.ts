export type PartialBoolean<T> = {
  [P in keyof T]?: boolean | undefined
}

export type PickEntityKeys<BoolRecord, DataRecord extends {[key in keyof DataRecord]: unknown} & {toObject(): Record<string, unknown>}> = {
  [Key in keyof BoolRecord]: Key extends keyof DataRecord ? 

    (BoolRecord[Key] extends true ? 
      (Key extends keyof ReturnType<DataRecord['toObject']> ?
        ReturnType<DataRecord['toObject']>[Key]
        : Key extends keyof DataRecord ?
          DataRecord[Key]
          // BoolRecord[Key] don't extends ReturnType<DataRecord['toObject']> | DataRecord[Key]
          : never)
      : (BoolRecord[Key] extends Record<string, boolean> ? 
        PickEntityKeys<BoolRecord[Key], DataRecord> 
        // BoolRecord[Key] don't extends Record<string, boolean>
        : never)) 
      // don't extends keyof DataRecord
    : never
}