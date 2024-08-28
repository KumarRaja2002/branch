// const v = require('valibot')
// export const otpSchema = v.object({
//     phone_number: v.pipe(
//      v.string(),
//      v.minLength(10),
//      v.maxLength(15),
//      v.nonEmpty()
//     ),
//     code:v.pipe(
//     v.optional( v.string()),
//     v.optional( v.minLength(4)),
//     v.optional( v.maxLength(6))
//      )
//  });
//  import { object, string, pipe, minLength, maxLength, optional, nonEmpty,startsWith } from 'valibot';
//  export const otpSchema = object(//@ts-ignore{//@ts-ignore
//   //@ts-ignore
//     phone_number: pipe(string(), minLength(10), maxLength(15), nonEmpty(),startsWith('+91')),
//     //@ts-ignore
//     code: pipe(optional(string()), optional(minLength(4)), optional(maxLength(6))),
//   });

