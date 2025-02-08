/* [grial-metadata] id: Grial#LabelHandler.cs version: 1.0.1 */
using Microsoft.Maui;
using Microsoft.Maui.Handlers;
using MauiLabelHandler = Microsoft.Maui.Handlers.LabelHandler;

namespace FitnessApp
{
    /// <summary>
    /// This handler fixes: https://github.com/dotnet/maui/issues/14125
    /// </summary>
    public class LabelHandler : MauiLabelHandler
    {
        public LabelHandler()
            : base(Mapper)
        {
            Mapper.AppendToMapping<Label, LabelHandler>(nameof(Label.LineBreakMode),(handler, label) =>
            {
                UpdateMaxLines(handler, label);
            });
            Mapper.AppendToMapping<Label, LabelHandler>(nameof(Label.MaxLines), (handler, label) =>
            {
                UpdateMaxLines(handler, label);
            });
        }

        private static void UpdateMaxLines(MauiLabelHandler handler, ILabel label)
        {
#if ANDROID
            var textView = handler.PlatformView;
            if (label is Label controlsLabel
                && textView.Ellipsize == Android.Text.TextUtils.TruncateAt.End
                && controlsLabel.MaxLines != -1)
            {
                textView.SetMaxLines(controlsLabel.MaxLines);
            }
#elif IOS
            var textView = handler.PlatformView;
            if( label is Label controlsLabel
                && textView.LineBreakMode == UIKit.UILineBreakMode.TailTruncation
                && controlsLabel.MaxLines != -1)
            {
                textView.Lines = controlsLabel.MaxLines;
            }  
#endif
        }
    }
}
